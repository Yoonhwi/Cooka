export interface CurrentUserProps {
  isLogin: boolean;
  user_Uid: number;
  user_Id: string;
}

export interface Comment extends Rowable {
  postId: number;
  writer: string;
  content: string;
  created_at: string;
}

export interface News extends Rowable {
  imgSrc: string;
  imgAlt: string;
  title: string;
  url: string;
  created_at: string;
}

export interface Recipe extends Rowable {
  imgSrc: string;
  imgAlt: string;
  title: string;
  likes: number;
  category: string;
  content: string;
  created_at: string;
  updated_at?: string;
  writer: string;
  isHot?: boolean;
}

export interface CsItem extends Rowable {
  title: string;
  writer: string;
  content: string;
  created_at: string;
}

export interface PlaceProps extends Rowable {
  imgSrc: string;
  imgAlt: string;
  title: string;
  likes: number;
  category: string;
  content: string;
  created_at: string;
  updated_at?: string;
  writer: string;
  isHot?: boolean;
}

export interface NewItem {
  imgSrc: string;
  imgAlt: string;
  title: string;
  url: string;
  created_at: string;
}

export interface User extends Rowable {
  name: string; //회원 이름
  nickname: string; //회원 닉네임
  phone_number: string; //회원 휴대폰번호
  login_id: string; //회원 id
  login_password: string; // 회원비밀번호
  login_type: string; //유저인지 관리자인지 판단
  social_id: number; //네이버,카카오 로그인을 구분하기위해 사용
  created_at?: string; // 회원가입한 시간
  updated_at?: string; // 수정한 시간
  profile_img: string; //프로필 이미지
  profile_text?: string; // 프로필 소갯말
  salt?: string;
}

export interface Rowable {
  id: number;
}
