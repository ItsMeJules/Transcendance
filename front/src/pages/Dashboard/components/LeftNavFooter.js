
const LeftNavFooter = ({ onSelectOption }) => {

	const handleOptionSelect = (option) => {
		onSelectOption(option);
	};

	return (
		<div className="footer left-nav-footer">
      <button onClick={() => handleOptionSelect('game')}>
        <img src="/images/game.png" alt="game" />
      </button>
      <button onClick={() => handleOptionSelect('spectate')}>
        <img src="/images/spectate.png" alt="spectate" />
      </button>
		</div>
	);
};

export default LeftNavFooter;
