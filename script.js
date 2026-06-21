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
    };
}
if (window.Alpine) {
    window.Alpine.data('spotifyApp', initSpotifyApp);
} else {
    document.addEventListener('alpine:init', () => {
        window.Alpine.data('spotifyApp', initSpotifyApp);
    });
}