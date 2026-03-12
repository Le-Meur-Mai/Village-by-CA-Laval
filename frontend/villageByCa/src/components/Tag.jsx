import '../styles/Tag.css';

const Tag = ({ name = "Tag", color = "CCF2B1", active=true, onClick }) => {
    return (
        <div className="tag">
            <button
                onClick={onClick}
                className={active ? "tag-active" : "tag-inactive"}
                style={{ backgroundColor: `#${color}` }}
            >
                {name}
            </button>
        </div>
    );
};

export default Tag;
