import { saveTabs } from "../functions";

const Footer = () => {
    return (
        <footer>
            <div>
                <a className="btn btn-save" onclick={saveTabs}>Save current tabs</a>
            </div>
            <div>
                <a href="https://sciensoft.dev">Sciensoft</a> &copy; 2023
            </div>
        </footer>
    );
}

export default Footer;