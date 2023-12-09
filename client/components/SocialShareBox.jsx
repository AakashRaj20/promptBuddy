import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
} from "next-share";

const SocialShare = ({ url }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Image
          src="/assets/icons/share.svg"
          alt="share_icon"
          width={23}
          height={23}
        />
      </PopoverTrigger>
      <PopoverContent className="popover_card">
        <div>
          <h3 className="font-satoshi font-semibold text-gray-900 dark:text-white">
            Share link
          </h3>
        </div>
        <div className="flex flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            defaultValue={url}
            readOnly
          />
          <Button type="submit" size="sm" className="px-3">
            <Image
              src="/assets/icons/copy.svg"
              alt="copy_icon"
              width={30}
              height={30}
            />
          </Button>
        </div>
        <div className="flex gap-4">
          <FacebookShareButton blankTarget url={url}>
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>
          <TwitterShareButton blankTarget url={url}>
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton blankTarget>
            <WhatsappIcon size={40} round={true} />
          </WhatsappShareButton>
          <LinkedinShareButton blankTarget>
            <LinkedinIcon size={40} round={true} />
          </LinkedinShareButton>
          <TelegramShareButton blankTarget>
            <TelegramIcon size={40} round={true} />
          </TelegramShareButton>
          <RedditShareButton blankTarget>
            <RedditIcon size={40} round={true} />
          </RedditShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;
