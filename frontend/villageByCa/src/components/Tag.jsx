import { useState } from "react";

import '../styles/Tag.css';

const Tag = ( {title = "Tag"} ) => {

    const [tagStatus, setTag] = useState(false);

    const ActivateTag = () => {
        setTag(!tagStatus);
    }

    return (
        <div className="tag">
            <button onClick={ ActivateTag } className={tagStatus ? "tag-active" : "tag-inactive"}>
                    { title }
            </button>
        </div>
    );
}

export default Tag;