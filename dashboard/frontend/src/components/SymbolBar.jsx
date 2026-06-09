const symbols = [

  "NIFTY50",
  "BANKNIFTY",
  "SENSEX",

  "RELIANCE",
  "TCS",
  "INFY",

  "HDFCBANK",
  "ICICIBANK",

  "SBIN",
  "ITC",

  "LT",
  "BHARTIARTL",
  "ASIANPAINT"

];

function SymbolBar({
  selectedSymbol,
  setSelectedSymbol
}) {

  return (

    <div className="symbol-bar">

      {

        symbols.map((symbol) => (

          <button
            key={symbol}
            className={
              selectedSymbol === symbol
                ? "symbol-btn active"
                : "symbol-btn"
            }
            onClick={() =>
              setSelectedSymbol(symbol)
            }
          >
            {symbol}
          </button>

        ))

      }

    </div>

  );

}

export default SymbolBar;