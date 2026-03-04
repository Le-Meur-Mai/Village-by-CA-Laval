import '../styles/PreFooter.css'

import Button from "./buttons/button";

const PreFooter = ({title = "title", text = "text", buttontext = "button"}) => {
    return (
        <div className='prefooter'>
            <h2 className='title-prefooter'>{ title }</h2>
            <p className='text-prefooter'>{ text }</p>
            <Button text={ buttontext } path = "/contact" />
        </div>
    )
}

export default PreFooter;