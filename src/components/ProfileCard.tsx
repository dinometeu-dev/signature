import React, { Fragment } from 'react'
import { cn } from '@/utils/functions/mergeClasses'
import Material, { GlassSurfaceProps } from '@/components/Material'
import {
  PROFILE_CARD_DESCRIPTION,
  PROFILE_CARD_NAME,
  PROFILE_CARD_STATUS,
} from '@/utils/constants/content'
import TiltedCard from '@/components/TitledCard'

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: GlassSurfaceProps
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ className, glass, ...props }, ref) => {
    return (
      <div className={cn('', className)} ref={ref} {...props}>
        <TiltedCard
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
          altText="Kendrick Lamar - GNX Album Cover"
          captionText="Kendrick Lamar - GNX"
          containerHeight="486px"
          containerWidth="296px"
          imageHeight="486px"
          imageWidth="296px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <Fragment>
              <div className="bg-gradient-to-t from-dark-green to-dark-green-0 w-full z-10 h-1/2 flex flex-col items-start justify-end p-5 pb-6 gap-2.5">
                <div className="text-white flex flex-col gap-1">
                  <h2 className="text-2xl font-sf-pro font-stretch-extra-expanded font-medium">
                    {PROFILE_CARD_NAME}
                  </h2>
                  <h5 className="text-sm font-sf-pro font-stretch-extra-expanded font-medium">
                    {PROFILE_CARD_STATUS}
                  </h5>
                </div>
                <p className="text-sm  text-white-800 font-sf-pro font-light">
                  {PROFILE_CARD_DESCRIPTION}
                </p>
              </div>
              <div className="absolute h-1/2 w-full progressive-backdrop-blur backdrop-blur-sm" />
            </Fragment>
          }
        />
      </div>
    )
  }
)

ProfileCard.displayName = 'ProfileCard'

export { ProfileCard }
