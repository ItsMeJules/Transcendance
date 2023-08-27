

const RightNavFooter = ({ onSelectOption }) => {

	const handleOptionSelect = (option) => {
		onSelectOption(option);
	};

	return (
		<div className="footer right-nav-footer">
      <button onClick={() => handleOptionSelect('chat')}>
        <img src="/images/chat.png" alt="chat" />
      </button>
      <button onClick={() => handleOptionSelect('friends')}>
        <img src="/images/friends.png" alt="friends" />
      </button>
      <button onClick={() => handleOptionSelect('leaderboard')}>
        <img src="/images/leaderboard.png" alt="leaderboard" />
      </button>
		</div>
	);
};

export default RightNavFooter;
