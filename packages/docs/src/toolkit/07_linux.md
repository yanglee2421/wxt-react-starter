# Linux

## WSL

以下命令依次为：

1. 安装分发版
2. 查看状态
3. 列出已安装的分发版
4. 注销已安装的分发版

```powershell
wsl --install
wsl --status
wsl --list
wsl --unregister ubuntu
```

## IP Forward

```bash
sysctl -w net.ipv4.ip_forward=1
```

## NodeJs

[nodesource](https://github.com/nodesource/distributions?tab=readme-ov-file#ubuntu-versions)
[pnpm](https://pnpm.io/installation#on-posix-systems)

```bash
# Install LTS by nodesource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Uninstall nodejs if installed by nodesource
apt-get purge nodejs &&\
rm -r /etc/apt/sources.list.d/nodesource.list &&\
rm -r /etc/apt/keyrings/nodesource.gpg

# Install LTS by pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm env use -g lts
pnpm env ls
pnpm env ls --remote
pnpm env add -g 18
pnpm env rm -g lts
```

## Commands

1. ssh user@127.0.0.1
2. ls -la
3. pwd
4. cd
5. touch
6. echo
7. nano
8. vim
9. cat
10. shred
11. mkdir
12. cp & mv
13. rm -r
14. rmdir
15. ln
16. clear
17. whoami
18. useradd
19. sudo
20. adduser
21. su
22. exit
23. passwd
24. apt
25. finger
26. man
27. whatis
28. whereis
29. wget
30. curl
31. zip
32. unzip
33. less
34. head
35. tail
36. cmp
37. diff
38. sort
39. find
40. chmod
41. chown
42. ifconfig
43. ip address
44. grep
45. awk
46. resolvectl
47. ping
48. traceroute
49. netstat
50. ss
51. iptables
52. ufw
53. uname
54. neofetch
55. cal
56. free
57. df
58. ps
59. top
60. htop
61. kill
62. pkill
63. systemctl
64. history
65. reboot
66. shutdown

```bash
ssh user@127.0.0.1
ls -la
pwd
cd
touch
echo
nano
vim
cat
shred
mkdir
cp
mv
rm -r
rmdir
ln
clear
su
```
