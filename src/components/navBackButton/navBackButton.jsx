

import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const NavBackButton = ({ callBack,to = -1, label = '返回', style = {}, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button
        className={"component-navbackbtn"}
      type="default"
      icon={<LeftOutlined />}
      onClick={callBack?callBack:handleClick}
      style={{ marginBottom: 16, ...style }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default NavBackButton;
