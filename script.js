function initSpotifyApp() {
    return {
        tracks: [],
        selectedTrack: null,
        isModalOpen: false,
        searchQuery: '',
    };
}
if (window.Alpine) {
    window.Alpine.data('spotifyApp', initSpotifyApp);
} else {
    document.addEventListener('alpine:init', () => {
        window.Alpine.data('spotifyApp', initSpotifyApp);
    });
}