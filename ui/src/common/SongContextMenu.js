import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useTranslate } from 'react-admin'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { playNext, addTracks, setTrack, openAddToPlaylist } from '../actions'
import subsonic from '../subsonic'
import { StarButton } from './StarButton'
import config from '../config'
import { formatBytes } from '../utils'

const useStyles = makeStyles({
  noWrap: {
    whiteSpace: 'nowrap',
  },
  menu: {
    visibility: (props) => (props.visible ? 'visible' : 'hidden'),
  },
})

export const SongContextMenu = ({
  resource,
  record,
  showStar,
  onAddToPlaylist,
  visible,
}) => {
  const classes = useStyles({ visible })
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [anchorEl, setAnchorEl] = useState(null)
  const options = {
    playNow: {
      enabled: true,
      label: translate('resources.song.actions.playNow'),
      action: (record) => dispatch(setTrack(record)),
    },
    playNext: {
      enabled: true,
      label: translate('resources.song.actions.playNext'),
      action: (record) => dispatch(playNext({ [record.id]: record })),
    },
    addToQueue: {
      enabled: true,
      label: translate('resources.song.actions.addToQueue'),
      action: (record) => dispatch(addTracks({ [record.id]: record })),
    },
    addToPlaylist: {
      enabled: true,
      label: translate('resources.song.actions.addToPlaylist'),
      action: (record) =>
        dispatch(
          openAddToPlaylist({
            selectedIds: [record.mediaFileId || record.id],
            onSuccess: (id) => onAddToPlaylist(id),
          })
        ),
    },
    download: {
      enabled: config.enableDownloads,
      label: `${translate('resources.song.actions.download')} (${formatBytes(
        record.size
      )})`,
      action: (record) => subsonic.download(record.mediaFileId || record.id),
    },
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
    e.stopPropagation()
  }

  const handleClose = (e) => {
    setAnchorEl(null)
    e.stopPropagation()
  }

  const handleItemClick = (e) => {
    e.preventDefault()
    setAnchorEl(null)
    const key = e.target.getAttribute('value')
    options[key].action(record)
    e.stopPropagation()
  }

  const open = Boolean(anchorEl)

  return (
    <span className={classes.noWrap}>
      {showStar && (
        <StarButton record={record} resource={resource} visible={visible} />
      )}
      <IconButton onClick={handleClick} size={'small'} className={classes.menu}>
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      <Menu
        id={'menu' + record.id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {Object.keys(options).map(
          (key) =>
            options[key].enabled && (
              <MenuItem value={key} key={key} onClick={handleItemClick}>
                {options[key].label}
              </MenuItem>
            )
        )}
      </Menu>
    </span>
  )
}

SongContextMenu.propTypes = {
  resource: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  onAddToPlaylist: PropTypes.func,
  visible: PropTypes.bool,
  showStar: PropTypes.bool,
}

SongContextMenu.defaultProps = {
  onAddToPlaylist: () => {},
  record: {},
  resource: 'song',
  visible: true,
  showStar: true,
  addLabel: true,
}
