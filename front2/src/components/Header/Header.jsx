import { Link } from "react-router-dom";
import classes from './Header.module.css'

export default function Header(){
    return (
        <header className={classes.Header}>
            <div className={classes.HeaderBody}>
                <div className={classes.HeaderLogo}>
                    Гениальное название
                </div>
                <ul className={classes.HeaderMenu}>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                        <a href={'/plan.html'}>Plan</a>
                    </li>
                </ul>
                <div className={classes.HeaderProfile}>
                    <input type="text" />
                    <img src="https://thumbs.dreamstime.com/b/fond-de-coeur-d-amour-d-arc-en-ciel-60045149.jpg" alt="" className={classes.HeaderProfileImage}/>
                </div>
            </div>
        </header>
    );
};