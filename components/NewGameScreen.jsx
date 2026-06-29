
export default function NewGameScreen(props) {
    return (
        <section className="new-game-screen">
            <h1>Quizzical</h1>
            <p>React Quiz App</p>
            <button className="start-btn" onClick={props.fn}>Start quiz</button>
        </section>
    )
}