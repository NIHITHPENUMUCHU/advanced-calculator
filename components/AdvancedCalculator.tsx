"use client"

import { useState, useEffect } from 'react'
import * as math from 'mathjs'
import { Moon, Sun, X, Trash2 } from 'lucide-react'

const buttons = [
  'C', '(', ')', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=', 'DEL',
  'sin', 'cos', 'tan', '^',
  'log', 'ln', 'π', 'e',
  '√', '!', 'abs', 'mod'
]

interface HistoryItem {
  expression: string;
  result: string;
}

export default function AdvancedCalculator() {
  const [display, setDisplay] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
    }
  }, [])

  const handleClick = (value: string) => {
    if (value === 'C') {
      setDisplay('')
    } else if (value === '=') {
      try {
        let expression = display
          .replace(/π/g, 'pi')
          .replace(/√/g, 'sqrt')
          .replace(/log/g, 'log10')
          .replace(/ln/g, 'log')
        const result = math.evaluate(expression)
        setDisplay(result.toString())
        setHistory(prev => [...prev, { expression: display, result: result.toString() }])
      } catch (error) {
        setDisplay('Error')
      }
    } else if (value === 'DEL') {
      setDisplay(display.slice(0, -1))
    } else if (value === 'π') {
      setDisplay(display + 'π')
    } else if (value === '√') {
      setDisplay(display + '√(')
    } else if (value === '!') {
      setDisplay(display + '!')
    } else {
      setDisplay(display + value)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const deleteHistoryItem = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index))
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`rounded-lg shadow-xl p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Advanced Calculator</h2>
          <div className="flex gap-2">
            <button
              onClick={toggleHistory}
              className={`px-2 py-1 text-sm rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1 rounded-full ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={display}
            readOnly
            className={`w-full text-right text-2xl font-bold p-2 rounded ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`text-lg font-semibold p-2 rounded ${
                ['C', '=', 'DEL'].includes(btn) 
                  ? `${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white` 
                : ['sin', 'cos', 'tan', 'log', 'ln', '√', '!', 'abs', 'mod'].includes(btn) 
                  ? `${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`
                : ['(', ')', '/', '*', '-', '+', '^'].includes(btn) 
                  ? `${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`
                : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
        {showHistory && (
          <div className={`mt-4 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>History</h3>
              <button
                onClick={clearHistory}
                className={`p-1 rounded ${isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-300'}`}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear history</span>
              </button>
            </div>
            {history.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No history yet</p>
            ) : (
              <ul className="space-y-1">
                {history.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {item.expression} = {item.result}
                    </span>
                    <button
                      onClick={() => deleteHistoryItem(index)}
                      className={`p-1 rounded ${isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-300'}`}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete history item</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}