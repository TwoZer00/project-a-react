import React, { Component } from "react";
import { getAudioUrl, getProfileImageURL } from "../utils/utils";
import CoverAudio from "./CoverAudio";
import ProgressBarPlayer from "./ProgressBarPlayer";

class PlayerA extends Component {
  constructor(props) {
    super(props);
    this.state = { audio: undefined, coverImage: undefined, progress: 0 };
    this.handleProgress = this.handleProgress.bind(this);
    this.handleInit = this.handleInit.bind(this);
    this.handlePlayBtn = this.handlePlayBtn.bind(this);
    this.handlePostChange = this.handlePostChange.bind(this);
    this.audioRef = React.createRef();
    this.progressBarRef = React.createRef();
  }
  async componentDidMount() {
    console.log("mount");
    // let coverImage =
    //   this.props.post.coverImg ||
    //   (await getProfileImageURL(this.props.post.userId));
    // // console.info(this.props.post);
    // const filePath = await getAudioUrl(this.props.post?.filePath);
    // this.setState({
    //   audio: filePath,
    //   coverImage: coverImage,
    // });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.post !== this.props.post) {
      return true;
    }
    return false;
  }
  handleProgress() {
    const duration = this.audioRef.current.duration;
    const currentTime = this.audioRef.current.currentTime;
    const width = this.progressBarRef.current.clientWidth;
    const progress = Math.round((currentTime * width) / duration);
    const porcentage = Math.round((progress / 742) * 100);
    this.setState({
      progress: porcentage,
    });
  }
  handlePlayBtn() {
    if (this.audioRef.current.paused) {
      this.audioRef.current.play();
    } else {
      this.audioRef.current.pause();
    }
  }
  async handleInit() {
    console.log("init");
    await this.handlePostChange();
  }
  async handlePostChange() {
    let coverImage =
      this.props.post.coverImg ||
      (await getProfileImageURL(this.props.post.userId));
    // console.info(this.props.post);
    const filePath = await getAudioUrl(this.props.post?.filePath);
    this.setState({
      audio: filePath,
      coverImage: coverImage,
    });
  }
  render() {
    if (this.props.post) {
      this.handleInit();
      return (
        <div className="h-full px-2 pb-2 dark:text-white">
          <audio
            src={this.state.audio}
            ref={this.audioRef}
            onTimeUpdate={this.handleProgress}
          ></audio>
          <div className="border rounded-md h-full flex flex-row">
            <div className="h-full w-[150px]">
              {/* <h1>{this.props.post.title}</h1> */}
              <CoverAudio src={this.state.coverImage} />
            </div>
            <div className="w-full flex flex-col h-full items-stretch">
              <p className="font-bold text-lg">{this.props.post.title}</p>
              <p className="text-sm truncate block">{this.props.post.desc}</p>
              <div className="flex flex-row items-center flex-1">
                <div onClick={this.handlePlayBtn}>playbutton</div>
                <ProgressBarPlayer
                  progress={this.state.progress}
                  reference={this.progressBarRef}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default PlayerA;
