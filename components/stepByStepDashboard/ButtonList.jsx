'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import classNames from 'classnames';
import NavigationButton from '@/components/stepByStepDashboard/NavigationButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const ButtonList = ({ buttons, level = 0, child = false, stepByStepData }) => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState({});

  const onExpand = (path) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [path]: !prevExpanded[path],
    }));
  };

  const onRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className='flex flex-col gap-4 relative'>
      {buttons
        .filter((btn) =>
          btn.roles ? btn?.roles?.includes(data.user?.role) : true
        )
        .map((button) => (
          <div
            key={button.id}
            className={classNames(
              'flex flex-col gap-1',
              level !== 1 && `pl-12`
            )}
          >
            <NavigationButton
              child={child}
              buttonId={button.id}
              onClick={() => onRedirect(button.path)}
              label={button.label}
              icon={button.icon || null}
              active={pathname === button.path}
              stepByStepData={stepByStepData}
              level={level}
              onExpand={() => onExpand(button.path)}
              expanded={expanded[button.path]}
              isChilds={button?.childs && button?.childs?.length > 0}
              buttonList={button?.childs}
            />
            <AnimatePresence>
              {expanded[button.path] && (
                <motion.div
                  key={button.path}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  exit={{ height: 0 }}
                  className='flex flex-col gap-1 overflow-hidden relative'
                >
                  <div className='h-full absolute left-6 w-0.5 bg-muted-foreground/50 z-50' />

                  <ButtonList
                    child={true}
                    buttons={button.childs}
                    level={level + 1}
                    buttonList={button?.childs}
                    stepByStepData={stepByStepData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
};

export default ButtonList;
