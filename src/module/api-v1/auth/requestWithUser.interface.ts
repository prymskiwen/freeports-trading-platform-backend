import { Request } from 'express';
import { UserDocument } from 'src/schema/user/user.schema';

 
interface RequestWithUser extends Request {
  user: UserDocument;
}
 
export default RequestWithUser;