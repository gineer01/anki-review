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
        },
        getCount: function(){
            return cards.length;
        }
    };
})();

var INIT = 0, READY = 1, FRONT = 2, BACK = 3;

var InnerReviewBox = React.createClass({
    render: function(){
        switch (this.props.stage){
            case INIT:
                return (<div>Loading cards...</div>);
            case READY:
                return (<div>
                    There are {cards.getCount()} card(s).
                    <button onClick={this.props.reviewHandler}> Review </button>
                </div>)
            case FRONT:
                var card = this.props.card;
                return (
                    <div>
                        <FrontSide front={card.front}/>
                        <button onClick={this.props.showHandler}> Show </button>
                    </div>
                );
            case BACK:
                var card = this.props.card;
                return (
                    <div>
                        <FrontSide front={card.front}/>
                        <BackSide front={card.front} back={card.back}/>
                        <Buttons handleCard={this.props.reviewHandler}/>
                    </div>
                );
        }
    }
});

var ReviewBox = React.createClass({
    getInitialState: function() {
        return {
            "currentCard": {},
            "stage" : INIT
        };
    },
    getNewCard: function(){
        this.setState({
            "currentCard" : cards.chooseRandom(),
            "stage" : FRONT
        });
    },
    showCard: function(){
        this.setState({
            "stage" : BACK
        });
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                cards.initCards(data);
                this.setState({
                    "stage" : READY
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="reviewBox">
                <InnerReviewBox stage={this.state.stage} card={this.state.currentCard}
                reviewHandler={this.getNewCard}
                showHandler={this.showCard}/>
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