import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    initialCurrency: 0,
    convertedCurrency: 0,
    curEx: {},
  };

  async componentDidMount() {
    const API_KEY = process.env.REACT_APP_API_KEY;
    try {
      const res = await fetch(
        `https://free.currencyconverterapi.com/api/v6/convert?apiKey=${API_KEY}&q=CAD_USD,USD_CAD&compact=y`,
      );
      const conversion = await res.json();
      this.setState({ curEx: conversion });
    } catch (e) {
      console.log(e);
    }
  }

  onChange = (e) => {
    if (e.target.value === null) {
      this.setState({ initialCurrency: 0, convertedCurrency: 0 });
    } else {
      this.setState({ initialCurrency: parseInt(e.target.value) }, () => {
        this.convert();
      }); // use callback function to immediately use new state
    }
  };

  convert = () => {
    const { initialCurrency, curEx } = this.state;
    const result = +(initialCurrency * curEx.CAD_USD.val).toFixed(2);
    this.setState({ convertedCurrency: result });
  };

  render() {
    const { convertedCurrency } = this.state;
    return (
      <div className="App">
        <h1>Currency Converter</h1>
        <input onChange={e => this.onChange(e)} type="text" />
        {' '}
CAD =
        <input readOnly type="text" value={convertedCurrency} />
        {' '}
USD
      </div>
    );
  }
}

export default App;
