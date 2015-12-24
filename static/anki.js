var cards = (function(){
    var cards, easy, hard;
    return {
        initCards : function(data){
            for (var i = 0; i < data.length; i++){
                data["num"] = i;
            }
            cards = data;
        },
        chooseRandom : function(){
            var randInt = Math.floor((Math.random() * cards.length));
            return cards[randInt];
        }
    };
})();

var ReviewBox = React.createClass({
    getInitialState: function() {
        return {"currentCard": {}};
    },
    getNewCard: function(){
        this.setState({"currentCard" : cards.chooseRandom()});
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                cards.initCards(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var cardDisplay = (function(card) {
            return (
                <div>
                    <FrontSide front={card.front}/>
                    <BackSide front={card.front} back={card.back}/>
                </div>
            );
        });
        var card = cardDisplay(this.state.currentCard);

        return (
            <div className="reviewBox">
                Review box
                {card}
                <Buttons handleCard={this.getNewCard}/>
            </div>
        );
    }
});

var FrontSide = React.createClass({
    render: function () {
        return (
            <div className="frontSide">
                {this.props.front}
            </div>
        );
    }
});

var BackSide = React.createClass({
    render: function () {
        return (
            <div className="backSide">
                {this.props.back}
            </div>
        );
    }
});

var Buttons = React.createClass({
    render: function () {
        return (
            <div className="buttons">
                <button onClick={this.props.handleCard}>New card</button>
            </div>
        );
    }
});

ReactDOM.render(
    <ReviewBox url="data.js"/>,
    document.getElementById('content')
);