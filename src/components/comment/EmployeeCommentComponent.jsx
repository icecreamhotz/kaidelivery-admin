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
      empName: props.empName,
      empId: props.empId,
      comment: [],
      loading: true
    };
  }

  componentDidMount() {
    this.loadCommentEmployeeById();
  }

  loadCommentEmployeeById = async () => {
    const { empId } = this.state;
    const comment = await API.get(`/employees/score/comment/${empId}`);
    const { data } = await comment;

    this.setState({
      comment: data.data,
      loading: false
    });
  };

  onClickDeleteComment = async empScoreId => {
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
          () => this.deleteComment(empScoreId)
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  deleteComment = async empScoreId => {
    const { comment } = this.state;
    await API.post(`/employees/score/comment/delete`, {
      empScoreId: empScoreId
    })
      .then(() => {
        const newComment = comment.filter(
          cmt => cmt.empscore_id !== empScoreId
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
    const { comment, loading, empName } = this.state;
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
          {empName}
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
                    src={`http://localhost:3000/users/${avatar}`}
                    alt={author}
                  />
                }
                content={
                  <div>
                    <p>{cmt.empscore_comment}</p>
                    <p>
                      <Tooltip title="Rating">
                        <Icon
                          type="star"
                          theme="twoTone"
                          twoToneColor="#f4d942"
                        />
                        <span style={{ paddingLeft: 8, cursor: "auto" }}>
                          {cmt.empscore_rating === null
                            ? "3.00"
                            : parseFloat(cmt.empscore_rating).toFixed(2)}
                        </span>
                      </Tooltip>
                    </p>
                  </div>
                }
                datetime={
                  <div>
                    <Tooltip
                      title={moment(cmt.empscore_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    >
                      <span>{moment(cmt.empscore_date).fromNow()}</span>
                    </Tooltip>
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        fontSize: 18,
                        cursor: "pointer"
                      }}
                      onClick={() => this.onClickDeleteComment(cmt.empscore_id)}
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
