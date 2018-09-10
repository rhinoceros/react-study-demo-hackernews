import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  }, {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },];

  const name ='Robbin';
  const key='name';
  const user = {
    [key]: name,
    name,
  };

  const userService = {
    getUserName(user){
      return user.firstName +' '+user.lastName;
    },
  }





const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list,
      searchTerm:'u',
    };
   this.onDismiss = this.onDismiss.bind(this);
   this.onSearchChange=this.onSearchChange.bind(this);

  }

  onDismiss(id){
     const updatedList = this.state.list.filter(item => item.objectID !== id);
     this.setState({list: updatedList});
  }
  onSearchChange(event)
  {
    this.setState({searchTerm: event.target.value});
  }
  
  render() {
    const helloWorld = {
      text: 'welcome',
    }
    helloWorld.text = "Welcome to React, This is ROCK's Demo."

    const {searchTerm, list}=this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{helloWorld.text}</h1>
        </header>

<form>
  <input type="text" value={searchTerm} onChange={this.onSearchChange}/>
  </form>
        {this.state.list.filter(isSearched(this.state.searchTerm)).map(item => {
           const onHandleDismiss = () => this.onDismiss(item.objectID);
           return (
           <div key={item.objectID}>
            <span>
              <a href={item.url}> {item.title} </a>
            </span>
            <span>
              {item.author}
            </span>
            <span>
              {item.num_comments}
            </span>
            <span>
              {item.points}
            </span>
            <span>
              <button 
                onClick={  onHandleDismiss} type = "button">
                Dismiss
              </button>
            </span>
            
          </div>);
        }
        )
        }
      </div>
    );
  }
}

export default App;
// export default ExplainBindingComponent;
