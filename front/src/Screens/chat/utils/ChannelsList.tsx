import PublicIcon from "../assets/globe.png"
import PrivateIcon from "../assets/private.png"
import ProtectedIcon from "../assets/padlock.png"

import { ChannelType } from "../models/Channel";
import { ChannelInfoInList } from "../models/partial/PartialModels";

interface ChannelListProps {
	channels: ChannelInfoInList[];
  onClickElement: (channel: string) => void
}

const ChannelsList: React.FC<ChannelListProps> = ({ channels, onClickElement }) => {
	const getIconFromType = (type: ChannelType) => {
		let iconSrc = PublicIcon;

		if (type === ChannelType.PROTECTED)
			iconSrc = ProtectedIcon;
		else if (type === ChannelType.PRIVATE)
			iconSrc = PrivateIcon;

		return (<img alt="Channel Type" src={iconSrc} />)
	}

	return (
		<div className="channel-list">
			{channels.map((channel, index) => (
				<div className="channel-container" onClick={() => onClickElement(channel.name)}>

					<div key={index} className="channel">
						<div className="type-picture">
							{getIconFromType(channel.type)}
						</div>

						<div className="channel-info">
							<p>{channel.name}</p>
							<p>Utiliasteurs: {channel.userCount || 0}</p>
						</div>
					</div>

				</div>
			))}
		</div>
	);
};

export default ChannelsList