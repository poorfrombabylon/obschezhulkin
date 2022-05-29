class TCardsScreen {
    constructor(cards) {
        this.cards = [
            new TStudentCard("123", "Nik", "Rat", "ICON"), new TStudentCard("123", "Nik", "Rat", "ICON"),
            new TStudentCard("123", "Nik", "Rat", "ICON"), new TStudentCard("123", "Nik", "Rat", "ICON")
        ]
        this.gridViewId = "#cardsGrid"
    }

    fillCards() {
        let cardsCount = this.cards.length
        var lastId = "#row" + 0

        for (let i = 0; i < cardsCount; i++) {
            if (i % 3 == 0) {
                lastId = "#row" + i
                let row = document.createElement("div")
                $(row)
                    .addClass("row")
                    .attr("id", lastId.slice(1))
                    .appendTo(this.gridViewId)
            }

            $(document.createElement("div"))
                .addClass("col-sm-4")
                .append(
                    $(document.createElement("div"))
                        .addClass("card")
                        .append(
                            $(document.createElement("div"))
                                .addClass("card-body")
                                .append(
                                    $(document.createElement("h5"))
                                        .addClass("card-title")
                                        .html("[Icon] " + this.cards[i].name + " " + this.cards[i].surname)
                                )
                                .append(
                                    $(document.createElement("p"))
                                        .addClass("card-text")
                                        .html("ANY DATA HERE")
                                )
                                .append(
                                    $(document.createElement("a"))
                                        .attr("href", "#")
                                        .addClass("btn btn-primary")
                                        .html("Go to profile")
                                )
                        )
                )
                .appendTo(lastId)
        }
    }
}

let cardsScreen = new TCardsScreen([])
cardsScreen.fillCards()
