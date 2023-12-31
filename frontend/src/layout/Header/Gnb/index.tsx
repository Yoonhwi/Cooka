import Styles from "./index.module.css";
import Link from "next/link";
const Gnb = () => {
  return (
    <div>
      <div className={Styles.gnb}>
        <div className={Styles.gnb_list} style={{ fontWeight: "400" }}>
          <Link href="/recipe">나만의 레시피</Link>
          <Link href="/news">꿀팁연구소</Link>
          <Link href="/place">이런곳도 있어요!</Link>
          <Link href="/counseling">요리상담소</Link>
        </div>
      </div>
    </div>
  );
};
export default Gnb;
