var cards = (function(){
    var cards = [], easy = [], hard = [];
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
        },
        markCard: function(card, choice){
            switch (choice){
                case EASY:
                    cards.splice(card.num, 1);
                    easy.push(card);
                case HARD:
                    hard.push(card);
            }
        }
    };
})();

var INIT = 0, READY = 1, FRONT = 2, BACK = 3, DONE = 4;
var EASY = 0, HARD = 1;

var InnerReviewBox = React.createClass({
    render: function(){
        switch (this.props.stage){
            case INIT:
                return (<div>Loading cards...</div>);

            case READY:
                return (<div>
                    There are {cards.getCount()} card(s).
                    <button onClick={this.props.handlers.reviewHandler}> Review </button>
                </div>);

            case FRONT:
                var card = this.props.card;
                return (
                    <div>
                        <FrontSide front={card.front}/>
                        <button onClick={this.props.handlers.showHandler}> Show </button>
                    </div>
                );

            case BACK:
                var card = this.props.card;
                return (
                    <div>
                        <FrontSide front={card.front}/>
                        <BackSide front={card.front} back={card.back}/>
                        <Buttons handleCard={this.props.handlers.submitHandler}/>
                    </div>
                );

            case DONE:
                return(<div>You completed the review</div>);
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
        if (cards.getCount() > 0){
            this.setState({
                "currentCard" : cards.chooseRandom(),
                "stage" : FRONT
            });
        }
        else {
            this.setState({
                "stage" : DONE
            });
        }
    },
    showCard: function(){
        this.setState({
            "stage" : BACK
        });
    },
    submitChoice: function(choice){
        cards.markCard(this.state.currentCard, choice);
        this.getNewCard();
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
        var handlers = {
            "reviewHandler" : this.getNewCard,
            "showHandler" : this.showCard,
            "submitHandler" : this.submitChoice
        }
        return (
            <div className="reviewBox">
                <InnerReviewBox stage={this.state.stage} card={this.state.currentCard}
                handlers={handlers}/>
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
                <button onClick={ () => {this.props.handleCard(EASY)} }>Easy</button>
                <button onClick={ () => {this.props.handleCard(HARD)} }>Hard</button>
            </div>
        );
    }
});

ReactDOM.render(
    <ReviewBox url="data.js"/>,
    document.getElementById('content')
);