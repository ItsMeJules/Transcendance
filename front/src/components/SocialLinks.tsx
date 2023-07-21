import { BsYoutube } from "react-icons/bs";

export const SocialLinks = () => {
    return (
        <section>
            <h3>My social medias</h3>
            <ul>
                <li className="flex items-center"><BsYoutube className="mr-1"/><a className="hover:underline hover:text-[red]" href="https://www.youtube.com/channel/UCs34BrDfNiKByWTRUN-8Vdg">Youtube</a></li>
            </ul>
        </section>
    )
}