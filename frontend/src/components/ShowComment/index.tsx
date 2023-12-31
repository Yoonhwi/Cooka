import { useState, useEffect } from "react";
import { Comment, User } from "@/types";
import Styles from "./index.module.css";
import { searchUser } from "@/api/getCurrentUser";
import { MakeComment } from "../MakeComment";
import { useRouter } from "next/router";
import { WantDeleteList } from "../WantDeleteList";
import Modal from "../Modal";
import ListPageMove from "../ListPageMove";
import AniButton from "../AniButton";
import GetUser from "@/utilities/GetUser";
import { replaceImage } from "@/utilities/replaceImage";
import parse from "html-react-parser";

interface ShowCommentProp {
  comments: Comment[];
  type: string;
}
const ShowComment = ({ comments, type }: ShowCommentProp) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [modify, setModify] = useState(false);
  const [findModifyComment, setFindModifyComment] = useState(-1); //수정된 댓글의 id값
  const [modifyText, setModifyText] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const itemnum = 3; //페이지당 출력될 item 수
  const indexOfLast = currentPage * itemnum; //slice할때 마지막item 순서
  const indexOfFirst = indexOfLast - itemnum; // slice할때 첫item순서

  const onClickDeleteModal = () => {
    setDeleteModal(false);
  };

  const onChangeModifyText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModifyText(e.target.value);
  };

  const CurrentPost = (post: Comment[]) => {
    let currentPosts: Comment[] = [];
    currentPosts = post.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  };

  useEffect(() => {
    GetUser(setUser);
  }, []);

  return (
    <>
      {CurrentPost(comments).map((comment) => (
        <div className={Styles.detail_comments} key={comment.id}>
          {deleteModal ? (
            <Modal
              closeModal={onClickDeleteModal}
              content={
                <WantDeleteList
                  closeModal={setDeleteModal}
                  id={findModifyComment}
                  type={`${type}_comment`}
                />
              }
            />
          ) : (
            ""
          )}
          <div className={Styles.comment_name}>
            <div>{comment.writer}</div>
            <div>|</div>
            <div>{comment.created_at}</div>
            {!!user && user?.nickname === comment.writer ? (
              <>
                <div>
                  <AniButton
                    className={Styles.modify_btn}
                    onClick={() => {
                      setDeleteModal(true);
                      setFindModifyComment(comment.id);
                    }}
                  >
                    삭제
                  </AniButton>
                </div>
                <div>
                  <AniButton
                    className={Styles.modify_btn}
                    onClick={() => {
                      setModify(true);
                      setFindModifyComment(comment.id);
                    }}
                  >
                    수정
                  </AniButton>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          {modify &&
          !!user &&
          user?.nickname === comment.writer &&
          comment.id === findModifyComment ? (
            <div className={Styles.modify_row}>
              <textarea
                className={Styles.comment_modify}
                defaultValue={comment.content}
                onChange={onChangeModifyText}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "1rem",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <AniButton
                  className={Styles.modify_row_btn}
                  onClick={async () => {
                    await MakeComment({
                      type: type,
                      text: modifyText,
                      apiRequestType: "put",
                      id: comment.id,
                    });
                    router.reload();
                  }}
                >
                  수정완료
                </AniButton>
                <AniButton
                  className={Styles.modify_row_btn}
                  onClick={() => setModify(false)}
                >
                  나가기
                </AniButton>
              </div>
            </div>
          ) : (
            <div className={Styles.comment_comment}>
              {parse(comment.content, replaceImage)}
            </div>
          )}
        </div>
      ))}
      <ListPageMove
        totalPosts={comments.length}
        postsPerPage={itemnum}
        pageMove={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
export default ShowComment;
