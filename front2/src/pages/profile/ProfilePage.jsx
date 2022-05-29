import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./ProfilePage.module.css"

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {

    })

        return (
            <div className={classes.ProfilePage}>
                <div className={classes.Profile}>
                    <img src="https://thumbs.dreamstime.com/b/fond-de-coeur-d-amour-d-arc-en-ciel-60045149.jpg" alt="" className={classes.ProfileAvatar}/>
                    <div className={classes.RoomInfo}>
                        Room 1
                    </div>
                </div>
                <div className={classes.ProfileInfo}>
                    <p>Name</p>
                    <p>Surname</p>
                    <p>Patronymic</p>
                    <p>Birthdate: 00.00.00</p>

                </div>
                <div className={classes.ProfileChar}>
                    <div className={classes.PositiveChars}>
                        <h3>Positive</h3>
                        <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos nam quisquam adipisci, architecto ipsam ipsa. </p>
                    </div>
                    <div className={classes.NegativeChars}>
                        <h3>Negative</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae quos sapiente fugit, magni cumque consequuntur.</p>
                    </div>
                </div>
            </div>
        );
}

export default ProfilePage;