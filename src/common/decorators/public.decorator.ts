import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);
//  ℹ️💬 To access Method if user is not logged in
// If you use this decoration, please exlude the associated route in authentication module / check session middleware
