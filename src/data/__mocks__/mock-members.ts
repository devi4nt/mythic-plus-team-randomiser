import type { ClassRole, ClassSpec, ClassType, Member } from 'src/types';
import { classSpecLust, classSpecRole, classSpecs } from '../specs';
import { shuffle } from '../../utils/array';

export const mockMembers = ({
  amount,
  classFilter,
  specFilter,
  roleFilter,
  includeLust
}: {
  amount?: number;
  classFilter?: ClassType;
  specFilter?: ClassSpec;
  roleFilter?: ClassRole;
  includeLust?: boolean;
} = {}) => {
  const members: Member[] = [];

  for (const cls of Object.keys(classSpecs)) {
    const roles = classSpecRole[cls as keyof typeof classSpecRole];
    for (const [spec, role] of Object.entries(roles)) {
      if (classFilter && cls !== classFilter) continue;
      if (specFilter && spec !== specFilter) continue;
      if (roleFilter && role !== roleFilter) continue;
      if (
        typeof includeLust !== 'undefined' &&
        includeLust !== classSpecLust[cls as keyof typeof classSpecLust]
      )
        continue;
      members.push({
        rank: 4,
        character: {
          name: `${spec} ${cls}`,
          realm: 'realm-name',
          class: cls as ClassType,
          active_spec_name: spec as ClassSpec,
          active_spec_role: role as ClassRole
        }
      });
    }
  }

  if (amount && amount > members.length) {
    throw new Error('amount is greater than the number of members');
  }

  // shuffle members
  shuffle(members);

  return amount ? members.slice(0, amount) : members;
};
