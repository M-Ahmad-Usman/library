// Book constructor
function Book(title, author, pages, haveRead) {
    // Do nothing if function is invoked without new keyword
    if (!new.target) throw new Error("You must use the 'new' operator to call the constructor");

    if (!(
            (typeof title === "string" && title.trim() !== "") && 
            (typeof author === "string" && author.trim() !== "") && 
            (typeof pages === "number") &&
            (typeof haveRead === "boolean"))
            
        ) throw new Error("All fields are required.");

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead ? "completed": "not read yet"}`;
}