const VideoHelper = {
  getYoutubeVideoId: (url) => {
    var rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(rx);
    return match == null ? null : match[1];
  },
};

export default VideoHelper;
