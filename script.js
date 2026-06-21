function initSpotifyApp() {
    return {
        tracks: [],
        selectedTrack: null,
        isModalOpen: false,
        searchQuery: '',
        init() {
            fetch('./data.json')
                .then(response => {
                    if (!response.ok) throw new Error("Impossible de lire data.json");
                    return response.json();
                })
                .then(data => {
                    this.tracks = data;
                })
                .catch(error => console.error("Erreur au chargement JSON :", error));
        }

        get filteredTracks() {
            if (!this.searchQuery.trim()) return this.tracks;
            const query = this.searchQuery.toLowerCase();
            return this.tracks.filter(track => 
                track.name.toLowerCase().includes(query) || 
                track.artists.some(artist => artist.name.toLowerCase().includes(query))
            );
        },
    };
}
if (window.Alpine) {
    window.Alpine.data('spotifyApp', initSpotifyApp);
} else {
    document.addEventListener('alpine:init', () => {
        window.Alpine.data('spotifyApp', initSpotifyApp);
    });
}