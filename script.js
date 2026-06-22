function initSpotifyApp() {
    return {
        tracks: [],
        selectedTrack: null,
        isModalOpen: false,
        searchQuery: '',

        artistsChartInstance: null,
        genresChartInstance: null,

        init() {
            fetch('./data.json')
                .then(response => {
                    if (!response.ok) throw new Error("Impossible de lire data.json");
                    return response.json();
                })
                .then(data => {
                    this.tracks = data;
                    setTimeout(() => this.initCharts(), 150);
                })
                .catch(error => console.error("Erreur au chargement JSON :", error));
        },

        get filteredTracks() {
            if (!this.searchQuery.trim()) return this.tracks;
            const query = this.searchQuery.toLowerCase();
            return this.tracks.filter(track => 
                track.name.toLowerCase().includes(query) || 
                track.artists.some(artist => artist.name.toLowerCase().includes(query))
            );
        },

        initCharts() {
            if (this.tracks.length === 0) return;

            // calculs artistes
            const artistCounts = {};
            this.tracks.forEach(track => {
                track.artists.forEach(artist => {
                    artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
                });
            });
            const sortedArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
            const artistLabels = sortedArtists.map(item => item[0]);
            const artistData = sortedArtists.map(item => item[1]);

            // calculs genres
            const genreCounts = {};
            this.tracks.forEach(track => {
                const genres = track.album.genres || (track.artists[0] && track.artists[0].genres) || [];
                genres.forEach(genre => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            });
            const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
            const topGenres = sortedGenres.slice(0, 7);
            const otherGenresCount = sortedGenres.slice(7).reduce((sum, item) => sum + item[1], 0);

            const genreLabels = topGenres.map(item => item[0]);
            const genreData = topGenres.map(item => item[1]);
            if (otherGenresCount > 0) {
                genreLabels.push("Autres");
                genreData.push(otherGenresCount);
            }

            // graph artistes
            const ctxArtists = document.getElementById('artistsChart')?.getContext('2d');
            if (ctxArtists) {
                if (this.artistsChartInstance) this.artistsChartInstance.destroy();
                this.artistsChartInstance = new Chart(ctxArtists, {
                    type: 'bar',
                    data: {
                        labels: artistLabels,
                        datasets: [{
                            label: 'Nombre de morceaux',
                            data: artistData,
                            backgroundColor: '#3b82f6',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }

            // graph genres
            const ctxGenres = document.getElementById('genresChart')?.getContext('2d');
            if (ctxGenres) {
                if (this.genresChartInstance) this.genresChartInstance.destroy();
                this.genresChartInstance = new Chart(ctxGenres, {
                    type: 'pie',
                    data: {
                        labels: genreLabels,
                        datasets: [{
                            data: genreData,
                            backgroundColor: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#9ca3af']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } }
                    }
                });
            }
        }
    };
}

if (window.Alpine) {
    window.Alpine.data('spotifyApp', initSpotifyApp);
} else {
    document.addEventListener('alpine:init', () => {
        window.Alpine.data('spotifyApp', initSpotifyApp);
    });
}