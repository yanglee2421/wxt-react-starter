import style from "./style.module.scss";
import { NavLink, useOutlet } from "react-router-dom";
import {
  Avatar,
  Button,
  Drawer,
  FloatButton,
  Input,
  Layout,
  Menu,
  MenuProps,
} from "antd";
import {
  BgColorsOutlined,
  BulbOutlined,
  BulbFilled,
  MenuOutlined,
  RocketOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useStyle, useResize } from "@/hooks";
import { useAppDispatch, useAppSelector, theme } from "@/redux";
import React, { useCallback, useMemo, useRef, useState } from "react";
import avatar from "@/assets/image/avatar/vergil.jpg";

export default function PageLayout() {
  const cx = useStyle(style);

  //   响应式布局
  const [vw, setVW] = useState(0);
  const resizeRef = useResize<HTMLElement>(({ width }) => setVW(width));
  const asider = useMemo(() => {
    if (vw < 576) return;
    return (
      <Layout.Sider collapsed={vw < 1400}>
        <AsiderContent />
      </Layout.Sider>
    );
  }, [vw]);
  const footer = useMemo(() => {
    if (vw > 575) return;
    return (
      <Layout.Footer className={cx("box-ft")}>
        <Button
          type="link"
          danger
          href="mailto:yanglee2421@outlook.com?subject=有bug&body=出处"
        >
          联系作者
        </Button>
      </Layout.Footer>
    );
  }, [vw]);

  //   toTopFloatBtn
  const cntRef = useRef<HTMLElement>(null);
  const [st, setST] = useState(0);
  const toTopHandler = useCallback(
    () => cntRef.current?.scroll({ top: 0, behavior: "smooth" }),
    [cntRef]
  );
  const toTopBtn = useMemo(() => {
    if (st === 0) return;
    return <FloatButton onClick={toTopHandler} icon={<RocketOutlined />} />;
  }, [st, toTopHandler]);

  //   darkFloatBtn
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const darkHandler = useCallback<React.MouseEventHandler<HTMLElement>>(
    (e) => {
      e.stopPropagation();
      dispatch(theme.actions.actIsDark(!isDark));
    },
    [isDark]
  );
  const darkBtn = useMemo(
    () => (
      <FloatButton
        onClick={darkHandler}
        icon={isDark ? <BulbOutlined /> : <BulbFilled />}
        type={isDark ? "primary" : "default"}
      />
    ),
    [isDark, darkHandler]
  );

  //   Drawer
  const [isDrawer, setIsDrawer] = useState(false);
  const drawer = useMemo(
    () => (
      <Drawer
        open={isDrawer}
        onClose={() => setIsDrawer((prev) => !prev)}
        placement={vw < 576 ? "top" : "left"}
        closeIcon={<MenuOutlined />}
      ></Drawer>
    ),
    [isDrawer, vw]
  );

  // 根据outlet生成content
  const outlet = useOutlet();
  const scHandler = useCallback(
    () => setST(cntRef.current?.scrollTop || 0),
    [cntRef]
  );
  const cnt = useMemo(() => {
    return (
      <Layout.Content
        ref={cntRef}
        onScroll={scHandler}
        className={cx("box-cnt")}
      >
        {outlet}
      </Layout.Content>
    );
  }, [outlet, scHandler]);

  return (
    <>
      {drawer}
      <Layout ref={resizeRef} className={cx("box")}>
        <Header onIconClick={() => setIsDrawer(true)} />
        <Layout>
          {asider}
          {cnt}
        </Layout>
        {footer}
      </Layout>
      <FloatButton.Group
        trigger="click"
        icon={<BgColorsOutlined />}
        type="primary"
      >
        {toTopBtn}
        {darkBtn}
      </FloatButton.Group>
    </>
  );
}

namespace t {
  export interface HeaderProps {
    onIconClick(): void;
  }
}

/**
 * Layout Header
 * @param props
 * @returns
 */
function Header(props: t.HeaderProps) {
  const { onIconClick } = props;
  const cx = useStyle(style);
  return (
    <Layout.Header className={cx("box-hd")}>
      <MenuOutlined onClick={onIconClick} />
      <Input.Search
        showCount
        maxLength={9}
        prefix={<SearchOutlined />}
        placeholder="do some thing"
        enterButton="Go"
      />
      <Avatar src={avatar} size={36} />
    </Layout.Header>
  );
}

function AsiderContent() {
  const cx = useStyle(style);
  const items: MenuProps["items"] = [
    {
      key: 1,
      label: "首页",
      icon: (
        <NavLink to="/">
          <HomeOutlined />
        </NavLink>
      ),
    },
    {
      key: 2,
      label: "Snow",
      icon: (
        <NavLink to="/snow">
          <HomeOutlined />
        </NavLink>
      ),
    },
    {
      key: 3,
      label: "Particle",
      icon: (
        <NavLink to="/particle">
          <HomeOutlined />
        </NavLink>
      ),
    },
  ];
  return <Menu items={items} className={cx("h-100")} />;
}