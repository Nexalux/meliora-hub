import "../../styles/components/bookmarks-header.css";

function BookmarksHeader() {
    return (
        <header className="bookmarks-header">

            <h1 className="bookmarks-header__title">
                My Bookmarks
            </h1>

            <p className="bookmarks-header__description">
                Keep every roadmap you want to revisit in one place.
                Continue learning whenever you're ready.
            </p>

        </header>
    );
}

export default BookmarksHeader;