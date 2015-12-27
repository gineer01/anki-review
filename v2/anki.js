var cards = (function(){
    var cards = [], easy = {}, hard = {};
    var total = 0;
    return {
        initCards : function(data){
            cards = data;
            total = data.length;
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

        getTotal: function(){
            return total;
        },

        getHardCards: function(){
            return Object.keys(hard).map(function (key) {
                return hard[key];
            })
        },

        markCard: function(card, choice){
            switch (choice){
                case EASY: //remove the card
                    cards.splice(card.num, 1);
                    easy[card.front] = card;
                    return;

                case AGAIN: //try again
                    return;

                case HARD: //saved to the Hard list
                    hard[card.id] = card;
                    return;
            }
        }
    };
})();

var INIT = 0, READY = 1, FRONT = 2, BACK = 3, DONE = 4, ERROR = 5;
var EASY = 0, AGAIN = 2, HARD = 1;

var InnerReviewBox = React.createClass({
    render: function(){
        var card = this.props.card;

        switch (this.props.stage){
            case INIT:
                return (<div className="alert alert-info">Loading cards...</div>);

            case READY:
                return (<div>
                    <div className="alert alert-info">There are {cards.getCount()} card(s).</div>
                    <button className="btn btn-primary btn-block btn-lg" onClick={this.props.handlers.reviewHandler}> Review </button>
                </div>);

            case FRONT:
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
                return(<div className="alert alert-success">You have completed the review.</div>);
        }
    }
});

var StatusBar = React.createClass({
    render: function () {
        var hardCards = cards.getHardCards().map(function(card){
            return (
                <tr key={card.id}>
                    <td>{card.front}</td>
                    <td>{card.id}</td>
                </tr>
            )
        });

        return (
            <div className="status">
                <div id="hardItems" className="panel panel-warning collapse hardItems">
                    <div className="panel-heading">Items to review further.</div>
                    <div className="panel-body">
                        <table className="table table-striped">
                            <thead>
                                <td>Question</td>
                                <td>Card ID</td>
                            </thead>
                        <tbody>
                        {hardCards}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="navbar navbar-fixed-bottom">
                    <div className="container-fluid">
                        <div className="col-xs-6 text-left">
                            Reviewed: <span className="label label-success">{cards.getTotal() - cards.getCount()}
                            / {cards.getTotal()}</span>
                        </div>
                        <div className="col-xs-6 text-center">
                            <button type="button" className="btn btn-warning"
                                    data-toggle="collapse" data-target="#hardItems">
                                Hard items: <span className="badge">{hardCards.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                <StatusBar/>
            </div>
        );
    }
});



var FrontSide = React.createClass({
    rawMarkup: function() {
        var rawMarkup = this.props.front;
        return { __html: rawMarkup };
    },
    render: function () {
        return (
            <div className="text-center frontSide">
                <h1><span dangerouslySetInnerHTML={this.rawMarkup()}/></h1>
            </div>
        );
    }
});

var BackSide = React.createClass({
    rawMarkup: function() {
        var rawMarkup = this.props.back;
        return { __html: rawMarkup };
    },
    render: function () {
        return (
            <div className="backSide text-center" dangerouslySetInnerHTML={this.rawMarkup()}>
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

var getDataParam = function(){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === "data") { //looking for "data" key
            return pair[1];
        }
    }

    return "demo.js";//default data location
};

ReactDOM.render(
    <ReviewBox url={getDataParam()}/>,
    document.getElementById('content')
);
