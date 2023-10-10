import { CsItem, PlaceProps, Recipe, User } from "@/types";
import Styles from "./index.module.css";
import { RecipeList } from "..";
import PlaceList from "../PlaceList";
import CounselingList from "../CounselingList";
import { useEffect, useState } from "react";
import { getMyComments } from "@/api/getMyComments";
interface ContentsByUserProps {
  onClick: any;
  user: User;
}
const ContentsByUser = ({ onClick, user }: ContentsByUserProps) => {
  const [likedRecipeList, setLikedRecipeList] = useState<Recipe[] | undefined>(
    undefined
  );
  const [likedPlaceList, setLikedPlaceList] = useState<
    PlaceProps[] | undefined
  >(undefined);
  const [likedCsList, setLikedCsList] = useState<CsItem[] | undefined>(
    undefined
  );
  useEffect(() => {
    getMyComments({
      user: user,
      setRecipe: setLikedRecipeList,
      setPlace: setLikedPlaceList,
      setCs: setLikedCsList,
      size: 4,
      page: 1,
    });
  }, []);
  const noData = () => {
    return (
      <div style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
        게시물이 존재하지 않습니다.
      </div>
    );
  };
  return (
    <div className={Styles.mycommentpage}>
      <div>
        <div style={{ position: "relative" }}>
          <div className={Styles.head_name}>레시피</div>
          {likedRecipeList && likedRecipeList.length > 3 ? (
            <div style={{ position: "absolute", right: "1rem", bottom: "0" }}>
              <button
                className={Styles.li_btn}
                onClick={() => onClick("댓글 레시피자세히보기")}
              >
                자세히보기
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        {likedRecipeList && likedRecipeList.length ? (
          <RecipeList item={likedRecipeList.slice(0, 3)} />
        ) : (
          noData()
        )}
      </div>
      <div>
        <div style={{ position: "relative" }}>
          <div className={Styles.head_name}>맛집</div>
          {likedPlaceList && likedPlaceList.length > 3 ? (
            <div style={{ position: "absolute", right: "1rem", bottom: "0" }}>
              <button
                className={Styles.li_btn}
                onClick={() => {
                  onClick("댓글 맛집자세히보기");
                }}
              >
                자세히보기
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        {likedPlaceList && likedPlaceList.length ? (
          <PlaceList items={likedPlaceList.slice(0, 3)} />
        ) : (
          noData()
        )}
      </div>
      <div>
        <div style={{ position: "relative" }}>
          <div className={Styles.head_name}>상담소</div>
          {likedCsList && likedCsList.length > 3 ? (
            <div style={{ position: "absolute", right: "1rem", bottom: "0" }}>
              <button
                className={Styles.li_btn}
                onClick={() => onClick("댓글 상담자세히보기")}
              >
                자세히보기
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        {likedCsList && likedCsList.length ? (
          <CounselingList items={likedCsList.slice(0, 3)} user={user} />
        ) : (
          noData()
        )}
      </div>
    </div>
  );
};
export default ContentsByUser;
