import { ChannelType } from "pages/ChatBox/models/Channel";
import { ChannelInfoInList } from "pages/ChatBox/models/partial/PartialModels";

interface ChannelListProps {
  channels: ChannelInfoInList[];
  onClickElement: (channel: string) => void
  filter?: (channelName: string) => boolean;
}

const ChannelsList: React.FC<ChannelListProps> = ({ channels, onClickElement, filter = () => true }) => {
  const getIconFromType = (type: ChannelType) => {
    let iconSrc = "/images/globe.png";
    if (type === ChannelType.PROTECTED)
      iconSrc = "/images/padlock.png";
    else if (type === ChannelType.PRIVATE)
      iconSrc = "/images/private.png";

    return (<img alt="Channel Type" src={iconSrc} />)
  }

  const filteredChannels = channels.filter(channel => filter(channel.name));

  return (
    <div className="channel-list">
      {filteredChannels.map((channel, index) => {
        return (
          <div key={index} className="channel-container" onClick={() => onClickElement(channel.name)}>

            <div className="channel">
              <div className="type-picture">
                {getIconFromType(channel.type)}
              </div>

              <div className="channel-info">
                <p>{channel.name}</p>
                <p>Members: {channel.userCount || 0}</p>
              </div>
            </div>

          </div>
        )
      })}
    </div>
  );
};

export default ChannelsList
