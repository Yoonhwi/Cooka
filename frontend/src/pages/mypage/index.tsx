import { RecipeList } from "@/components";
import CounselingList from "@/components/CounselingList";
import CounselingPageMove from "@/components/CounselingPageMove";
import PlaceList from "@/components/PlaceList";
import PlacePageMove from "@/components/PlacePageMove";
import NewsPageMove from "@/components/RecipePageMove";
import SearchUserData from "@/components/SearchUserData";
import { CsItem, PlaceProps, Recipe, Table, User } from "@/types";
import getMyComments from "@/utilities/getMyComments";
import { useEffect, useState } from "react";
import Styles from "./index.module.scss";
import { useRef } from "react";
import ContentsByUser from "@/components/ContentsByUser";
import axios from "axios";
import { getCurrentUser, searchUser } from "@/fetch/getCurrentUser";
import { useRouter } from "next/router";
const Mypage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checkType, setCheckType] = useState<string>("마이페이지");
  const [myRecipe, setMyRecipe] = useState<Recipe[]>();
  const [myPlace, setMyPlace] = useState<PlaceProps[]>();
  const [myCs, setMyCs] = useState<CsItem[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [imgFile, setImgFile] = useState<any>(""); //any수정하기
  const [profileEdit, setProfileEdit] = useState<boolean>(false);
  const [profileText, setProfileText] = useState<string>();

  const [uniqueCsList, setUniqueCsList] = useState<CsItem[]>();
  const [uniqueRecipeList, setUniqueRecipeList] = useState<Recipe[]>();
  const [uniquePlaceList, setUniquePlaceList] = useState<PlaceProps[]>();

  const imgRef = useRef<HTMLInputElement>(null);
  const ITEMNUM = 9;
  const indexOfLast = currentPage * ITEMNUM;
  const indexOfFirst = indexOfLast - ITEMNUM;
  const router = useRouter();
  const onChangeProfileText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProfileText(event.target.value);
    console.log(profileText);
  };
  const saveImgFile = () => {
    if (imgRef.current != null && imgRef.current.files != null) {
      const file = imgRef.current.files[0];
      if (file === undefined) {
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImgFile(reader.result);
        };
      }
    } else return;
  };
  const CurrentPost = <T extends Table>(posts: T): T => {
    return posts.slice(indexOfFirst, indexOfLast) as T;
  };

  const noData = () => {
    return (
      <div style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
        게시물이 존재하지 않습니다.
      </div>
    );
  };

  const TypeByContent = (type: string) => {
    if (type === "내가작성한 레시피") {
      if (myRecipe?.length) {
        return (
          <>
            <RecipeList items={CurrentPost(myRecipe)} />
            <NewsPageMove
              totalPosts={myRecipe.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      } else {
        return noData();
      }
    } else if (type === "내가작성한 맛집") {
      if (myPlace?.length) {
        return (
          <>
            <PlaceList items={CurrentPost(myPlace)} />
            <PlacePageMove
              totalPosts={myPlace.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      } else {
        return noData();
      }
    } else if (type === "내가작성한 질문") {
      if (myCs?.length) {
        return (
          <>
            <CounselingList items={CurrentPost(myCs)} />
            <CounselingPageMove
              totalPosts={myCs.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      } else {
        return noData();
      }
    } else if (type === "내가댓글단 게시물") {
      if (user) {
        return (
          <ContentsByUser
            uniqueRecipeList={uniqueRecipeList}
            uniquePlaceList={uniquePlaceList}
            uniqueCsList={uniqueCsList}
            onClick={setCheckType}
          />
        );
      } else return;
    } else if (type === "마이페이지") {
      return (
        <div className={Styles.profile}>
          <div>프로필 이미지 등록</div>
          <div className={Styles.profile_img}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <img
                src={user?.profile_img}
                alt="프로필 이미지"
                className={Styles.img_preview}
              />
              <div>이미지 미리보기</div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={saveImgFile}
                ref={imgRef}
                id="upload"
              />
              <label htmlFor="upload" className={Styles.upload_btn}>
                업로드
              </label>
              <button
                className={Styles.upload_btn}
                style={{ marginLeft: "1rem" }}
              >
                등록완료
                {/**등록완료 버튼 클릭시 fetch POST imgFile(암호화되있는듯 ? 엄청김 변환하는법알아내기)) */}
              </button>
              <div style={{ paddingTop: "2rem" }}>
                <div>이미지 업로드후 등록완료를 꼭 눌러주세요!</div>
                <div>등록완료를 눌러야 저장됩니다!</div>
              </div>
            </div>
          </div>
          <div>프로필 소개</div>
          <div className={Styles.introduction}>
            {user?.profile_text && !profileEdit ? (
              <div className={Styles.introduction_text}>
                {user.profile_text}
              </div>
            ) : profileEdit ? (
              <textarea
                onChange={onChangeProfileText}
                className={Styles.introduction_text_edit}
              >
                {user?.profile_text}
              </textarea>
            ) : (
              "자기소개를 입력해보세요!"
            )}
          </div>
          <div
            style={{
              paddingTop: "3rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "right",
            }}
          >
            {profileEdit ? (
              <>
                <button
                  className={Styles.upload_btn}
                  onClick={() => setProfileEdit(false)}
                >
                  수정취소
                </button>
                <button className={Styles.upload_btn}>수정완료</button>
                {/**수정완료 클릭시 user.introduction를
                 * profileText 로 fetch update
                 */}
              </>
            ) : (
              <button
                className={Styles.upload_btn}
                onClick={() => {
                  setProfileEdit(true);
                }}
              >
                수정
              </button>
            )}
          </div>
        </div>
      );
    } else if (checkType === "댓글 맛집자세히보기") {
      if (uniquePlaceList && uniquePlaceList.length) {
        return (
          <>
            <PlaceList items={CurrentPost(uniquePlaceList)} />
            <PlacePageMove
              totalPosts={uniquePlaceList.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      }
    } else if (checkType === "댓글 레시피자세히보기") {
      if (uniqueRecipeList && uniqueRecipeList.length) {
        return (
          <>
            <RecipeList items={CurrentPost(uniqueRecipeList)} />
            <NewsPageMove
              totalPosts={uniqueRecipeList.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      }
    } else if (checkType === "댓글 상담자세히보기") {
      if (uniqueCsList && uniqueCsList.length) {
        return (
          <>
            <CounselingList items={CurrentPost(uniqueCsList)} />
            <CounselingPageMove
              totalPosts={uniqueCsList.length}
              postsPerPage={ITEMNUM}
              pageMove={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        );
      }
    }
  };
  useEffect(() => {
    const getUserData = async () => {
      const getU = await searchUser();
      await setUser(getU);
      if (getU != undefined) {
        const { myRecipe, myCs, myPlace } = SearchUserData(getU);
        setMyRecipe(myRecipe);
        setMyCs(myCs);
        setMyPlace(myPlace);
        setCurrentPage(1);
        const { uniqueCsList, uniqueRecipeList, uniquePlaceList } =
          getMyComments(getU.nickname);
        setUniqueCsList(uniqueCsList);
        setUniqueRecipeList(uniqueRecipeList);
        setUniquePlaceList(uniquePlaceList);
      } else {
        alert("로그인이 필요합니다!");
        router.push("/");
      }
    };
    getUserData();
  }, []);

  return (
    //사람버튼 로그인상태시 마우스 올리면 로그아웃 마이페이지 노출 => 마이페이지화면
    <div className={Styles.mypage}>
      <div className={Styles.mypage_head}>
        <h1
          className={Styles.head_left}
          onClick={() => setCheckType("마이페이지")}
        >
          <button className={Styles.head_btn}>마이페이지</button>
        </h1>
        <div className={Styles.head_right}>
          <h1 style={{}}>{checkType}</h1>
        </div>
      </div>
      <div className={Styles.mypage_container}>
        <div className={Styles.snb_column}>
          <div className={Styles.snb_subhead}>내가 작성한글</div>
          <ul className={Styles.snb_menu}>
            <li onClick={() => setCheckType("내가작성한 레시피")}>
              <button className={Styles.li_btn}>나만의 레시피</button>
            </li>
            <li onClick={() => setCheckType("내가작성한 맛집")}>
              <button className={Styles.li_btn}>이런곳도 있어요!</button>
            </li>
            <li onClick={() => setCheckType("내가작성한 질문")}>
              <button className={Styles.li_btn}>요리연구소</button>
            </li>
          </ul>
          <div className={Styles.snb_subhead}>나의 관심목록</div>
          <ul className={Styles.snb_menu}>
            <li onClick={() => setCheckType("내가추천한 게시물")}>
              <button className={Styles.li_btn}>추천한 목록</button>
            </li>
            <li onClick={() => setCheckType("내가댓글단 게시물")}>
              <button className={Styles.li_btn}>댓글단 목록</button>
            </li>
          </ul>
        </div>
        <div className={Styles.content}>{TypeByContent(checkType)}</div>
      </div>
    </div>
  );
};
export default Mypage;
