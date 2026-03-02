import '../styles/PreFooter.css'

import Button from "./buttons/button";

const PreFooter = ({title, text, buttontext}) => {
    return (
        <div className='prefooter'>
            <h3 className='title'>{ title }</h3>
            <p className='text'>{ text }</p>
            <Button text={ buttontext } path = "/contact" />
        </div>
    )
}

export default PreFooter;