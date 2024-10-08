import "./Title.scss";

const Title = ({ titleText, size = 18 }) => {
    return (
      <div className="title">
        <h3 style={{ fontSize: size }}>{titleText}</h3>
        {/* <p>{titleText}</p> */}
      </div>
    );
  };
  
export default Title;