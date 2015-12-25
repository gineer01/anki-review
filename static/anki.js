var cards = (function(){
    var cards = [], easy = {}, hard = {};
    return {
        initCards : function(data){
            cards = data;
        },
        chooseRandom : function(){
            var randInt = Math.floor((Math.random() * cards.length));
            var card = cards[randInt];
            card.num = randInt; //the position to remove later
            return card;
        },
        getCount: function(){
            return cards.length;
        },
        markCard: function(card, choice){
            switch (choice){
                case EASY: //remove the card
                    cards.splice(card.num, 1);
                    easy[card.front] = card;

                case AGAIN: //try again
                    return;

                case HARD: //saved to the Hard list
                    hard[card.front] = card;
            }
        }
    };
})();

var INIT = 0, READY = 1, FRONT = 2, BACK = 3, DONE = 4, ERROR = 5;
var EASY = 0, AGAIN = 2, HARD = 1;

var InnerReviewBox = React.createClass({
    render: function(){
        switch (this.props.stage){
            case INIT:
                return (<div className="alert alert-info">Loading cards...</div>);

            case READY:
                return (<div>
                    <div className="alert alert-info">There are {cards.getCount()} card(s).</div>
                    <button className="btn btn-primary btn-block btn-lg" onClick={this.props.handlers.reviewHandler}> Review </button>
                </div>);

            case FRONT:
                var card = this.props.card;
                return (
                    <div className="panel panel-info">
                        <div className="panel-body">
                            <FrontSide front={card.front}/>
                        </div>
                        <div className="panel-footer">
                            <button className="btn btn-primary btn-block btn-lg" onClick={this.props.handlers.showHandler}> Show </button>
                        </div>
                    </div>
                );

            case BACK:
                var card = this.props.card;
                return (
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            <FrontSide front={card.front}/>
                        </div>
                        <div className="panel-body">
                            <BackSide front={card.front} back={card.back}/>
                        </div>
                        <div className="panel-footer">
                            <Buttons handleCard={this.props.handlers.submitHandler}/>
                        </div>
                    </div>
                );

            case DONE:
                return(<div className="alert alert-success">You completed the review</div>);
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
                this.setState({
                    "stage" : ERROR,
                    "message" : "Error loading data"
                })
            }.bind(this)
        });
    },

    render: function () {
        if (this.state.stage == ERROR){
            return (<div className="alert alert-danger">{this.state.message}</div>)
        }
        var handlers = {
            "reviewHandler": this.getNewCard,
            "showHandler": this.showCard,
            "submitHandler": this.submitChoice
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
                <h1>{this.props.front}</h1>
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
            <div className="buttons row">
                <button type="button" className="btn btn-success btn-lg col-xs-4" onClick={ () => {this.props.handleCard(EASY)} }>Easy</button>
                <button type="button" className="btn btn-primary btn-lg col-xs-4" onClick={ () => {this.props.handleCard(AGAIN)} }>Again</button>
                <button type="button" className="btn btn-warning btn-lg col-xs-4" onClick={ () => {this.props.handleCard(HARD)} }>Hard</button>
            </div>
        );
    }
});

ReactDOM.render(
    <ReviewBox url="data.js"/>,
    document.getElementById('content')
);