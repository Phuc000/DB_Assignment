import "./Title.scss";

const Title = ({ titleText }) => {
    return (
      <div className="title">
        <p>{titleText}</p>
      </div>
    );
  };
  
export default Title;