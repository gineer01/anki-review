var ReviewBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var test = this.state.data.map(function(card) {
            return (

                <div><FrontSide front={card.front}/>
                <BackSide front={card.front} back={card.back}/></div>
            );
        });

        return (
            <div className="reviewBox">
                Review box
                {test}
                <Buttons/>
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
            </div>
        );
    }
});

ReactDOM.render(
    <ReviewBox url="data.js"/>,
    document.getElementById('content')
);