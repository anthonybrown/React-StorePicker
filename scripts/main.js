var React       = require('react');
var ReactDOM    = require('react-dom');
/* react-router componets */
var ReactRouter = require('react-router');
var Router      = ReactRouter.Router;
var Route       = ReactRouter.Route;
var Navigation  = ReactRouter.Navigation;// mixin /* changed it 1.0 */
var History     = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');
/* get the helpers.js file */
var h = require('./helpers');

/*
  App
*/

 var App = React.createClass({
   // create an initial state for the App
   getInitialState: function () {
		return {
			fishes : {},
			order  : {}
		}
	 },

	 addFish: function(fish) {
		 var timestamp = (new Date()).getTime();
		 // update the state object.
		 this.state.fishes['fish-' + timestamp] = fish;
		 // set the statee
		 this.setState({ fishes : this.state.fishes });
	 },

	 loadSamples: function() {
	   this.setState({
		   fishes: require('./sample-fishes')
		 });
	 },

	 renderFish: function (key) {
		 return <Fish key={key} index={key} details={this.state.fishes[key]} />
	 },

	 render: function () {
	 	 return (
			<div className='catch-of-the-day'>
				<div className='menu'>
					<Header tagline='Fresh Seafood Is Awesome!' />
						<ul className="list-of-fishes">
							{Object.keys(this.state.fishes).map(this.renderFish)}
						</ul>
				</div>
				<Order />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		 )
	}
 });

/*
	Fish
	<Fish />
	*/

var Fish = React.createClass({
	render: function() {
		var details = this.props.details;
		return (
			<li className='menu-fish'>
				<img src={details.image} alt={details.name} />
				<h3 className="fish-name">{details.name}
					<span className='price'>{h.formatPrice(details.price)}</span>
				</h3>
				<p>{details.desc}</p>
			</li>
		)
	}
});

/*
	 Add Fish Form
	 <AddFishForm />
*/

 var AddFishForm = React.createClass({
	 createFish: function (e) {
	 // 1. stop the form from submitting
	 e.preventDefault();
	 // 2. take the data from the form and create an object
	 var fish = {
	   name   : this.refs.name.value,
		 price  : this.refs.price.value,
		 status : this.refs.status.value,
		 desc   : this.refs.desc.value,
		 image  : this.refs.image.value
	 }
		// 3. Add the fish to the App State
	 this.props.addFish(fish);
	 this.refs.fishForm.reset();
	},

	render: function () {
		return (
			<form className='fish-edit' ref='fishForm' onSubmit={this.createFish}>
				<input type="text" ref='name' placeholder='Fish Name' />
				<input type='text' ref='price' placeholder='Fish Price' />
				<select ref='status'>
					<option value='available'>Fresh!</option>
					<option value='unavailable'>Sold Out!</option>
				</select>
				<textarea type='text' ref='desc' placeholder='Desc'></textarea>
				<input type='text' ref='image' placeholder='URL to image' />
				<button type='submit'>+ Add Item </button>
			</form>
		)
	}
 });

/*
  Header
  <Header />
*/

 var Header = React.createClass({
	render: function () {
		{/*console.log(this.props);*/}
		return (
			<header className='top'>
				<h1>
					Catch
					<span className='ofThe'>
						<span className='of'>of</span>
						<span className='the'>the</span>
					</span>
					Day!</h1>
				<h3 className='tagline'><span>{this.props.tagline}</span></h3>
			</header>
		)
	}
 });

/*
	 Order
	 <Order />
*/

 var Order = React.createClass({
	render: function () {
		return (
			<p>Order</p>
		)
	}
 });

/*
 Inventory
 <Inventory />
*/

var Inventory = React.createClass({
	render: function () {
		return (
			<div>
				<h2>Inventory</h2>

				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
});

/*
 Store picker
 This will let us make <StorePicker />
*/

var StorePicker = React.createClass({
  mixins: [History],
	goToStore: function (e) {
		//console.log(this.refs.storeId.value);
		// get the data from the form
		var storeId = this.refs.storeId.value;
		//console.log(storeId)
		// if not using react or react-router
		// we would do something like this.
		//window.location.hash = '# ' + storeID;
		this.history.pushState(null, '/store/' + storeId);
		// transistion from <StorePicker /> to <App />

		e.preventDefault();
	},

	render: function () {
		return (
			<form className='store-selector' onSubmit={this.goToStore}>
				<h2>Please Enter A Store. </h2>
				<input type='text' ref='storeId' defaultValue={h.getFunName()} required />
				<input type='submit' />
			</form>
		)
	}
});

/*
  Not Found
  404
*/

var NotFound = React.createClass({
	render: function() {
		return <h1>Sorry, Not Found!</h1>
	}
});

/*
  Routes
*/

var routes = (
	<Router history={createBrowserHistory()}>
		<Route path='/' component={StorePicker} />
		<Route path='/store/:storeId' component={App} />
		<Route path='*' component={NotFound} />
	</Router>
);

ReactDOM.render(routes, document.querySelector('#main'))
