import React, { Component } from "react";
import {
  Comment,
  Icon,
  Tooltip,
  Avatar,
  Modal,
  message,
  Typography,
  Empty
} from "antd";
import API from "../../helpers/api.js";
import Loading from "../loaders/loading.js";
import moment from "moment";
import "moment/locale/th";

const { Title } = Typography;
const confirm = Modal.confirm;
moment.locale("th");

class RestaurantCommentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resName: props.resName,
      resId: props.resId,
      comment: [],
      loading: true
    };
  }

  componentDidMount() {
    this.loadCommentRestaurantById();
  }

  loadCommentRestaurantById = async () => {
    const { resId } = this.state;
    const comment = await API.get(`/restaurants/score/comment/${resId}`);
    const { data } = await comment;

    this.setState({
      comment: data.data,
      loading: false
    });
  };

  onClickDeleteComment = async resScoreId => {
    confirm({
      title: "Are you sure delete this comment?",
      content: "please choose some choice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.setState(
          {
            loading: true
          },
          () => this.deleteComment(resScoreId)
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  deleteComment = async resScoreId => {
    const { comment } = this.state;
    await API.post(`/restaurants/score/comment/delete`, {
      resscoreId: resScoreId
    })
      .then(() => {
        const newComment = comment.filter(
          cmt => cmt.resscore_id !== resScoreId
        );
        this.setState({
          comment: newComment,
          loading: false
        });
        message.success("Delete Success");
      })
      .catch(() => {
        message.error("Something has wrong :(");
      });
  };

  render() {
    const { comment, loading, resName } = this.state;
    const { back } = this.props;
    if (loading) return <Loading loaded={loading} />;
    return (
      <div>
        <Title>
          <Icon
            type="left"
            style={{ cursor: "pointer" }}
            onClick={() => back()}
          />{" "}
          {resName}
        </Title>
        {comment.length > 0 ? (
          comment.map(cmt => {
            const author =
              cmt.user === null
                ? "Guest Guest"
                : `${cmt.user.name} ${cmt.user.lastname}`;
            const avatar = cmt.user === null ? "noimg.png" : cmt.user.avatar;
            return (
              <Comment
                author={<a>{author}</a>}
                avatar={
                  <Avatar
                    src={`https://kaidelivery-api.herokuapp.com/users/${avatar}`}
                    alt={author}
                  />
                }
                content={
                  <div>
                    <p>{cmt.resscore_comment}</p>
                    <p>
                      <Tooltip title="Rating">
                        <Icon
                          type="star"
                          theme="twoTone"
                          twoToneColor="#f4d942"
                        />
                        <span style={{ paddingLeft: 8, cursor: "auto" }}>
                          {cmt.resscore_rating === null
                            ? "3.00"
                            : parseFloat(cmt.resscore_rating).toFixed(2)}
                        </span>
                      </Tooltip>
                    </p>
                  </div>
                }
                datetime={
                  <div>
                    <Tooltip
                      title={moment(cmt.resscore_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    >
                      <span>{moment(cmt.resscore_date).fromNow()}</span>
                    </Tooltip>
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        fontSize: 18,
                        cursor: "pointer"
                      }}
                      onClick={() => this.onClickDeleteComment(cmt.resscore_id)}
                    >
                      <Icon
                        type="delete"
                        theme="twoTone"
                        twoToneColor="#f44741"
                      />
                    </span>
                  </div>
                }
              />
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}

export default RestaurantCommentComponent;
