import React, { useEffect, useRef, useState, useReducer } from "react";
import animals from "./animals.json";
import classNames from "./classNames";

function App() {
  let currentWordIndex = 0;

  const [randomWord, setRandomWord] = useState<string[]>();
  const [blankspace, setBlankspace] = useState<string[]>(
    new Array(randomWord?.length).fill("")
  );
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userScore, setUserScore] = useState<number>(0)
  const [guessed, setGuessed] = useState<string[]>()

  interface Props {
    border?: string;
    color?: string;
    children?: React.ReactNode;
    height?: string;
    onClick?: () => void;
    radius?: string;
    width?: string;
    disabled?: boolean;
    size?: string;
    variant?: string;
  }

  function GetRandomAnimal() {
    let value = animals[Math.floor(Math.random() * animals.length)];
    if (guessed?.includes(value)) {
      value = animals.filter((guessedWord) => guessedWord !== value)[
        Math.floor(Math.random() * animals.length)
      ];
    }
    setRandomWord(value?.split("") || "".split(""));
    setIsInvalid(false)
    setIsMatched(false)
    blankspace.fill("")
    }

  const handleOnChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newBlankspace: string[] = [...blankspace];
    newBlankspace[currentWordIndex] = value.substring(value.length - 1);
    if (!value) setActiveWordIndex(currentWordIndex - 1);
    else setActiveWordIndex(currentWordIndex + 1);
    setBlankspace(newBlankspace);
  };

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,     
    index: number,
  ) => {
    currentWordIndex = index;
    if (key === "ArrowLeft") {
      setActiveWordIndex(currentWordIndex - 1);
    }
    if (key === "ArrowRight")
      setActiveWordIndex(currentWordIndex + 1);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      blankspace.join("") === randomWord?.slice(1, -1).join("") &&
      !guessed?.includes(randomWord.join(""))
    ) {
      setIsMatched(true);
      setUserScore(userScore + 1)
      setGuessed((prevstate) =>
        prevstate ? [...prevstate, randomWord.join("")] : [randomWord.join("")]
      );
    } else setIsInvalid(true);
   };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeWordIndex]);

  return (
    <div className="main">
      <div className="title">
        <span className="score">{userScore}</span>
        <h2>Guess the animal</h2>
      </div>
      <button
        className="hint"
        onClick={GetRandomAnimal}>
        Shuffle
      </button>
      <div>
        <form
          onSubmit={handleSubmit}
          className="crosswordBoxForm">
          <div className="crosswordBox">
            {randomWord?.map((letter, idx) => {
              if (idx === 0 || idx === randomWord?.length - 1) {
                return (
                  <input
                    readOnly
                    className={classNames(
                      "crossword",
                      (isMatched && "matched") || (isInvalid && "invalid")
                    )}
                    key={idx}
                    value={letter.toUpperCase()}></input>
                );
              }
              return (
                <div key={idx}>
                  <input
                    ref={idx == activeWordIndex ? inputRef : null}
                    type="text"
                    className={classNames(
                      "crossword",
                      (isMatched && "matched") || (isInvalid && "invalid")
                    )}
                    onChange={handleOnChange}
                    onKeyDown={(e) => handleOnKeyDown(e, idx)}
                    value={blankspace[idx]?.toUpperCase() || ""} 
                    // added the conditional to avoid the uncontrolled input warning // it's a technical debt
                  />
                  {idx === blankspace.length - 1 ? null : ""}
                </div>
              );
            })}
          </div>
          <div className="crosswordSubmit">
            <button
              type="submit"
              className="hint">
              Enter
            </button>
          </div>
       </form>
      </div>
    </div>
  );
}

export default App;
