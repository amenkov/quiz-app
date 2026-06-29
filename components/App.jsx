import { useState } from "react"
import NewGameScreen from "./NewGameScreen"
import Quiz from "./Quiz"

export default function App() {

    const [isNewGame, setIsNewGame] = useState(true)

    function startGame() {
        setIsNewGame(false)
    }


    return (
        <main>
            {isNewGame && <NewGameScreen fn={startGame}/>}
            {!isNewGame && <Quiz />}
        </main>
    )
}