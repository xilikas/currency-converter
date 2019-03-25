import React, { Component } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://free.currencyconverterapi.com/api/v6';

class App extends Component {
  state = {
    initialCurrency: 0,
    initialCurrencyId: 'CAD',
    convertedCurrency: 0,
    convertedCurrencyId: 'USD',
    curEx: {},
    countries: [],
    limit: false,
  };

  async componentDidMount() {
    // Get countries
    try {
      // Check API limit usage
      let res = await fetch(`https://free.currencyconverterapi.com/others/usage?apiKey=${API_KEY}`);
      const limit = await res.json();
      if (limit.usage >= 100) {
        this.setState({ limit: limit.usage });
      } else {
        res = await fetch(`${BASE_URL}/countries?apiKey=${API_KEY}`);
        const countries = await res.json();
        this.setState({ countries: Object.values(countries.results) });
        this.curEx();
      }
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
    this.curEx();
    // Have to pull out exchange rate
    const rate = curEx[Object.keys(curEx)[0]];
    const result = +(initialCurrency * rate).toFixed(2);
    this.setState({ convertedCurrency: result });
  };

  handleInitialSelect = (e) => {
    this.setState({ initialCurrencyId: e.target.value });
  };

  handleConvertedSelect = (e) => {
    this.setState({ convertedCurrencyId: e.target.value });
  };

  // Get currency exchange
  curEx = async () => {
    try {
      const { initialCurrencyId, convertedCurrencyId } = this.state;
      const res = await fetch(
        `${BASE_URL}/convert?apiKey=${API_KEY}&q=${initialCurrencyId}_${convertedCurrencyId}&compact=ultra`,
      );
      const conversion = await res.json();
      this.setState({ curEx: conversion });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { limit, convertedCurrency, countries } = this.state;
    return (
      <div className="App">
        <h1>Currency Converter</h1>
        {limit && (
          <>
            <h1>API LIMIT REACHED</h1>
            <h3>Please come back at the hour</h3>
          </>
        )}
        {!limit && (
          <>
            <input onChange={e => this.onChange(e)} type="number" />
            <select onChange={e => this.handleInitialSelect(e)}>
              {countries.map(country => (
                <option key={country.id} value={country.currencyId}>
                  {country.currencyId}
                </option>
              ))}
            </select>
            {' '}
            =
            <input readOnly type="text" value={convertedCurrency} />
            <select onChange={e => this.handleConvertedSelect(e)}>
              {countries.map(country => (
                <option key={country.id} value={country.currencyId}>
                  {country.currencyId}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    );
  }
}

export default App;
